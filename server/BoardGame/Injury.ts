import { Injury as PureInjury } from "@prisma/client";
import { InjuryState } from "lib/gameState";
import Aid from "./Aid";

export default class Injury {
    private treatTimeout?: NodeJS.Timeout;

    private treatPromises: { [aidId: number]: { promise: Promise<boolean>, resolve: (success: boolean) => void } } = {};

    constructor(private data: PureInjury) {

    }

    public getId(): number {
        return this.data.id;
    }

    public getState(): InjuryState {
        return this.data;
    }

    public getBodyLocation(): string {
        return this.data.bodyLocation;
    }

    public getVictimId(): number {
        return this.data.victimId;
    }

    public getSeverity(): number {
        return this.data.severity;
    }

    public isEnabled(): boolean {
        return this.data.enabled;
    }

    public enable(): void {
        this.data.enabled = true;
    }

    public disable(): void {
        this.data.enabled = false;
    }

    public isTreated(): boolean {
        return this.data.treated;
    }

    public flagTreated(): void {
        this.data.treated = true;
    }

    public getRequiredAids(): number {
        return this.data.requiredAids;
    }

    public getRequiredTimeInSeconds(): number {
        return this.data.requiredTime * 60;
    }

    public isProcessed(): boolean {
        return !!this.treatTimeout;
    }

    public isDoable(): boolean {
        return this.isEnabled() && !this.isTreated() && !this.isProcessed();
    }

    public getManpower(): number {
        return Object.keys(this.treatPromises).length;
    }

    public async treat(aid: Aid): Promise<boolean> {
        if (this.isTreated()) {
            return true;
        }

        if (aid.getId() in this.treatPromises) {
            return this.treatPromises[aid.getId()].promise;
        }

        if (this.getManpower() >= this.getRequiredAids()) {
            throw new Error('Already enough aids to treat this injury');
        }

        this.treatPromises[aid.getId()] = {} as any;

        const promise = new Promise<boolean>(resolve => {
            this.treatPromises[aid.getId()].resolve = resolve;
        });

        this.treatPromises[aid.getId()].promise = promise;

        if (this.getManpower() === this.getRequiredAids()) {
            console.log(`Start treatment. It will take ${this.data.requiredTime * 60} seconds`);

            this.treatTimeout = setTimeout(() => {
                this.data.treated = true;

                for (const treatPromise of Object.values(this.treatPromises)) {
                    treatPromise.resolve(this.data.treated);
                }

                this.treatTimeout = undefined;
                this.treatPromises = {};
            }, this.data.requiredTime * 60 * 1000);
        }

        return promise;
    }

    public abortTreatment(aid?: Aid): void {
        if (this.isTreated()) {
            return;
        }

        if (this.treatTimeout) {
            clearTimeout(this.treatTimeout);

            this.treatTimeout = undefined;
        }

        if (!aid) {
            for (const treatPromise of Object.values(this.treatPromises)) {
                treatPromise.resolve(this.data.treated);
            }

            this.treatPromises = {};
        } else if (aid.getId() in this.treatPromises) {
            this.treatPromises[aid.getId()].resolve(this.data.treated);

            delete this.treatPromises[aid.getId()];
        }
    }

    public toString(): string {
        let output = `[V${this.getVictimId()}][I${this.getId()}] ${this.getBodyLocation()}`;

        if (this.isEnabled()) {
            output += `, ${this.getManpower()} / ${this.getRequiredAids()}`;
            output += `, ${this.isTreated() ? 'treated' : 'pending'}`;
        }
        output += `, ${this.isEnabled() ? 'enabled' : 'disabled'}`;

        return output;
    }
}