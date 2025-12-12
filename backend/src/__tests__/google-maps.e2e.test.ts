import { DistanceMatrixLocation, getDistanceMatrix } from "../externalAPI/google-maps";


describe("Google Maps API Integration", () => {
    it("fetches routes data successfully", async () => {
        const origins: DistanceMatrixLocation[] = [
                { type: "latLng", latitude: 55.93, longitude: -3.118 },
                { type: "address", address: "Greenwich, England" },
            ];
            const destinations: DistanceMatrixLocation[] = [
                { type: "address", address: "Stockholm, Sweden" },
                { type: "latLng", latitude: 50.087, longitude: 14.421 },
            ];

        
        const distanceResponseFormat = {
            originIndex: expect.any(Number),
            destinationIndex: expect.any(Number),
            status: expect.any(Object),
            distanceMeters: expect.any(Number),
            duration: expect.any(String),
            condition: expect.any(String)
        }

        const distanceMatrix = await getDistanceMatrix(origins, destinations);
        
        expect(distanceMatrix).toEqual(expect.arrayContaining([
            expect.objectContaining(distanceResponseFormat),
        ]));
        console.debug(distanceMatrix);
    });
});