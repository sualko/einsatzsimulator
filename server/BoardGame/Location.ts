import { Location as PureLocation } from ".prisma/client";
import { deg2rad, earthRadius } from "lib/helper";


export default class Location {
    constructor(private data: PureLocation) {

    }

    public getId(): number {
        return this.data.id;
    }

    public getData(): PureLocation {
        return this.data;
    }

    public getName(): string {
        return this.data.name;
    }

    public getLatitude(): number {
        return this.data.latitude;
    }

    public getLongitude(): number {
        return this.data.longitude;
    }

    public getDistanceToInMeters(location: Location): number {
        const dLat = deg2rad(location.getLatitude() - this.getLatitude());
        const dLon = deg2rad(location.getLongitude() - this.getLongitude());

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(location.getLatitude())) * Math.cos(deg2rad(this.getLatitude())) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadius * angle * 1000;
    }

    public getBearingInDegrees(location: Location) {
        const lon1 = deg2rad(this.getLongitude());
        const lat1 = deg2rad(this.getLatitude());
        const lon2 = deg2rad(location.getLongitude());
        const lat2 = deg2rad(location.getLatitude());

        const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
        const theta = Math.atan2(y, x);

        return (theta * 180 / Math.PI + 360) % 360;
    }
}