// Helper fn which saves events for a specific TX and dumps them into console.

interface EmittedEvent {
    name: string,
    args: any[],
}

export const saveEvents = async (tx: any) => {
    const emittedEvents: EmittedEvent[] = [];
    const receipt = await tx.wait();
    receipt.logs.forEach((ev: any) => {
        if (ev.fragment?.type === 'event') {
            const args = ev.args.map((arg: any) => {
                if (arg._isBigNumber) {
                    // Check if the argument is a BigNumber
                    return arg.toString() // Convert it to a string
                }
                return arg
            })
            emittedEvents.push({
                name: ev.fragment.name,
                args: args,
            })
        }
    })
    console.log(`emittedEvents: `, emittedEvents)
}
