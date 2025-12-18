// Products that are within walking distance (always show walking icon)
const WALKING_PRODUCTS = [3, 5]; // Hammock and Clas Ohlson Lamp

// Generate deterministic mock travel times based on product ID
// Ensures all products (including new ones) have consistent mock data
export const generateMockTravelData = (
  productId: number
): { publicTime: number; carTime: number; walkTime?: number } => {
  // Special handling for walking-distance products
  if (WALKING_PRODUCTS.includes(productId)) {
    // Walking time: random but consistent (5-14 minutes)
    const walkTime = ((productId * 13) % 10) + 5; // 5-14 range
    return {
      publicTime: walkTime,
      carTime: walkTime,
      walkTime: walkTime,
    };
  }

  // Use product ID as seed to generate consistent but varied times
  // Ranges per spec:
  // - Public transport: 8–80 minutes
  // - Car: 8–32 minutes
  const publicRange = 80 - 8 + 1; // 73 values
  const carRange = 32 - 8 + 1; // 25 values

  const publicTimeBase = ((productId * 11) % publicRange) + 8; // 8–80 range
  const carTimeBase = ((productId * 7) % carRange) + 8; // 8–32 range
  
  return {
    publicTime: publicTimeBase,
    carTime: carTimeBase,
  };
};

export const getTravelInfo = (
  productId: number,
  haveCar: boolean
): { time: number; transport: string } => {
  const data = generateMockTravelData(productId);

  // Walking-distance products always show walking icon
  if (data.walkTime !== undefined) {
    return { time: data.walkTime, transport: "🚶 Walk" };
  }

  if (haveCar) {
    return { time: data.carTime, transport: "🚗 Car" };
  }

  return { time: data.publicTime, transport: "🚌 Public Transport" };
};
