import axios from "axios"; // npm install axios

const SHIPPO_API_URL = "https://api.goshippo.com";
const SHIPPO_KEY = process.env.SHIPPO_API_KEY!; // from .env file

// The commission rate — comes from env, not hardcoded
const COMMISSION_RATE = parseFloat(process.env.COMMISSION_RATE || "0.15");
//                                                                  ^^^^
//                                             15% commission by default

interface ShipmentInput {
  packageDetails: {
    length: number;
    width: number;
    height: number;
    mass_unit: string;
    weight: number;
    distance_unit: string;
  };
  senderAddress: {
    name: string;
    street1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  receiverAddress: {
    name: string;
    street1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export const fetchRatesWithCommission = async (input: ShipmentInput) => {
  // Step 1: Create a Shippo "Shipment" object — this triggers rate fetching
  const response = await axios.post(
    `${SHIPPO_API_URL}/shipments/`,
    {
      address_from: input.senderAddress,
      address_to: input.receiverAddress,
      parcels: [
        {
          length: String(input.packageDetails.length),
          width: String(input.packageDetails.width),
          height: String(input.packageDetails.height),
          distance_unit: input.packageDetails.distance_unit,
          weight: String(input.packageDetails.weight),
          mass_unit: input.packageDetails.mass_unit,
        },
      ],
      async: false, // important: wait for rates to be ready
    },
    {
      headers: {
        Authorization: `ShippoToken ${SHIPPO_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  const shippoRates = response.data.rates; // array of rate objects from Shippo

  // Step 2: Add commission to each rate and return
  // IMPORTANT: we store finalRate (with commission), NOT the raw carrier rate
  const ratesWithCommission = shippoRates.map((rate: any) => {
    const carrierRate = parseFloat(rate.amount);
    const commission = carrierRate * COMMISSION_RATE;
    const finalRate = parseFloat((carrierRate + commission).toFixed(2));

    return {
      carrier: rate.provider, // e.g. "UPS"
      service: rate.servicelevel.name, // e.g. "Ground"
      finalRate, // what the user pays
      currency: rate.currency,
      deliveryDays: rate.estimated_days,
      shippoRateId: rate.object_id, // needed to book later
    };
  });

  return ratesWithCommission;
};
