import { PrismaClient, Qualification, Consciousness, Pupils, BodyLocation, Leader } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {

    const scenario = await prisma.scenario.upsert({
        where: {
            id: 1,
        },
        update: {},
        create: {
            id: 1,
            name: 'Test',
            description: 'This is a test scenario',
            latitude: 47.68991,
            longitude: 9.27843,
            matches: {
                create: {
                    id: 'd9b4eced-ef1e-443c-9d28-697ade4056db',
                },
            },
        }
    });

    await prisma.location.upsert({
        where: {
            id: 1,
        },
        update: {},
        create: {
            id: 1,
            name: 'Damage zone',
            scenarioId: scenario.id,
            latitude: 47.68996,
            longitude: 9.27875,
            victims: {
                createMany: {
                    data: [{
                        name: 'Hildegard',
                        age: 80,
                        ableToWalk: true,
                        consciousness: Consciousness.orientated,
                        pupils: Pupils.normal,
                        pupilReaction: true,
                        breathing: 12,
                        scenarioId: scenario.id,
                    }]
                }
            }
        },
    });

    await prisma.location.upsert({
        where: {
            id: 2,
        },
        update: {},
        create: {
            id: 2,
            name: 'Assembly area',
            scenarioId: scenario.id,
            latitude: 47.69069,
            longitude: 9.27757,
            aids: {
                createMany: {
                    data: [{
                        name: 'Karl',
                        age: 30,
                        qualification: Qualification.SAN,
                        leader: Leader.None,
                        scenarioId: scenario.id,
                    }, {
                        name: 'Carla',
                        age: 31,
                        qualification: Qualification.SAN,
                        leader: Leader.None,
                        scenarioId: scenario.id,
                    }, {
                        name: 'Klaus',
                        age: 31,
                        qualification: Qualification.RH,
                        leader: Leader.Group,
                        scenarioId: scenario.id,
                    }]
                }
            }
        },
    });

    const treatmentUnit = await prisma.location.upsert({
        where: {
            id: 3,
        },
        update: {},
        create: {
            id: 3,
            name: 'Behandlungsplatz',
            scenarioId: scenario.id,
            latitude: 47.68984,
            longitude: 9.27972,
        },
    });

    const sabine = await prisma.victim.create({
        data: {
            name: 'Sabine',
            age: 40,
            ableToWalk: true,
            consciousness: Consciousness.orientated,
            pupils: Pupils.normal,
            pupilReaction: true,
            breathing: 12,
            locationId: treatmentUnit.id,
            scenarioId: scenario.id,
        },
    });

    const brokenLeg = await prisma.injury.create({
        data: {
            enabled: true,
            bodyLocation: BodyLocation.leftLeg,
            severity: 5,
            pain: 8,
            description: 'Open fracture',
            treated: false,
            requiredTime: 3,
            requiredAids: 2,
            requiredEquipment: 1,
            victimId: sabine.id,
        }
    });

    await prisma.event.create({
        data: {
            time: 1,
            ableToWalk: false,
            victim: {
                connect: {id: sabine.id},
            },
            dependencies: {
                connect: [{id: brokenLeg.id}]
            },
        }
    });

    const promises = ['Susi', 'Renate', 'Peter', 'Karl', 'Frieda', 'Carla', 'Mike', 'Jon', 'Axel', 'Daniel', 'Fred', 'King'].map(name => {
        return prisma.victim.create({
            data: {
                name,
                age: 40,
                ableToWalk: Math.random() < 0.5,
                consciousness: Consciousness.orientated,
                pupils: Pupils.normal,
                pupilReaction: true,
                breathing: 12,
                locationId: treatmentUnit.id,
                scenarioId: scenario.id,
            },
        })
    });

    await Promise.all(promises);

}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })