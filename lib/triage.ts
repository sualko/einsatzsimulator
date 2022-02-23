import { Priority } from "@prisma/client";

export const TriageColor = {
    [Priority.Unknown]: '#ffffff',
    [Priority.Dead]: '#000000',
    [Priority.T1]: '#ff0000',
    [Priority.T2]: '#ffff00',
    [Priority.T3]: '#00ff00',
    [Priority.T4]: '#0000ff',
}