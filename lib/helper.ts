
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const earthRadius = 6371;
export const deg2rad = (deg: number) => deg * (Math.PI / 180);
export const rad2deg = (rad: number) => rad / (Math.PI / 180);

export const calculateCurrentCoordinates = (
    startLatitude: number,
    startLongitude: number,
    startTime: Date,
    bearing: number,
    walkingSpeedInMeters: number) => {
    const millisecondsElapsed = (new Date()).getTime() - startTime.getTime();

    if (millisecondsElapsed <= 0) {
        throw new Error('Start time must be in the past to calculate current coordinates');
    }

    const distanceInMeters = walkingSpeedInMeters * millisecondsElapsed / 1000;
    const angularDistance = distanceInMeters / (earthRadius * 1000);

    console.log('Distance covered', distanceInMeters);

    const lat1 = deg2rad(startLatitude);
    const lon1 = deg2rad(startLongitude);
    const theta = deg2rad(bearing);

    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(angularDistance) + Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(theta));
    const lon2 = lon1 + Math.atan2(Math.sin(theta) * Math.sin(angularDistance) * Math.cos(lat1), Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2));

    return {
        latitude: rad2deg(lat2),
        longitude: rad2deg(lon2),
    };
}