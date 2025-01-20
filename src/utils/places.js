import districtPlaces from '../data/district-places.json';
import meetupPlaces from '../data/meetup-places.json';

export function getDistrictPlaces() {
    return districtPlaces.map(place => place.name);
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}

export function getOptimalMeetupPlace(buyerPostalCode) {
    const buyerPlace = districtPlaces.find(place => place.name === buyerPostalCode);

    if (!buyerPlace) {
        return null;
    }

    const distances = meetupPlaces.map(meetupPlace => {
        const buyerLat = parseFloat(buyerPlace.coordinates.lat);
        const buyerLon = parseFloat(buyerPlace.coordinates.lng);
        const meetupLat = parseFloat(meetupPlace.coordinates.lat);
        const meetupLon = parseFloat(meetupPlace.coordinates.lng);
        const distance = calculateDistance(buyerLat, buyerLon, meetupLat, meetupLon);
        return {
            ...meetupPlace,
            distance: distance,
        };
    });

    distances.sort((a, b) => a.distance - b.distance);

    return distances.map(place => `${place.name} (${place.distance.toFixed(2)} km)`);
}