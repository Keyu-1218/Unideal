import axios from "axios";


export type DistanceMatrixLocation = { type: "latLng", latitude: Number, longitude: Number } | { type: "address", address: String };

const locationToWaypoint = (loc: DistanceMatrixLocation) => {
    switch (loc.type) {
        case "latLng":
            return { waypoint: { location: { latLng: { latitude: loc.latitude, longitude: loc.longitude } } } };
        case "address":
            return { waypoint: { address: loc.address } };
    }
};

type DistanceMatrixResponse = {
    originIndex: number,
    destinationIndex: number,
    status: object,
    distanceMeters: number,
    duration: `${number}s`,
    condition: 'ROUTE_MATRIX_ELEMENT_CONDITION_UNSPECIFIED' | 'ROUTE_EXISTS' | 'ROUTE_NOT_FOUND'
}[];

enum TravelMode {
    DRIVE = "DRIVE",
    BICYCLE = "BICYCLE",
    WALK = "WALK",
    TWO_WHEELER = "TWO_WHEELER",
    TRANSIT = "TRANSIT"
}

export const getDistanceMatrix = async (origins: DistanceMatrixLocation[], destinations: DistanceMatrixLocation[]): Promise<DistanceMatrixResponse> => {
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

    const response = await axios.post(
        "https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix",
        {
            "origins": origins.map(locationToWaypoint),
            "destinations": destinations.map(locationToWaypoint),
            "travelMode": TravelMode.DRIVE,
            "routingPreference": "TRAFFIC_AWARE",
            "units": "METRIC",
        },
        {
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": API_KEY,
                "X-Goog-FieldMask":
                    "originIndex,destinationIndex,status,condition,distanceMeters,duration",
            },
        },
    );

    return response.data;
};