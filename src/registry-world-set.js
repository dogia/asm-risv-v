export class RegistryWorldSet {
    static __keys = (()=>{
        RegistryWorldSet['X0'] = ['x0', 'zero']
        RegistryWorldSet['X1'] = ['x1', 'ra']
        RegistryWorldSet['X2'] = ['x2', 'sp']
        RegistryWorldSet['X3'] = ['x3', 'gp']
        RegistryWorldSet['X4'] = ['x4', 'tp']

        // Generate 5-7
        for(let i=5; i<8;i++)
            RegistryWorldSet[`X${i}`] = [`x${i}`, `t${i-5}`];

        RegistryWorldSet['X8'] = ['x8', 's0', 'fp']
        RegistryWorldSet['X9'] = ['x9', 's1']

        // Generate 10-17
        for(let i=10; i<18;i++)
            RegistryWorldSet[`X${i}`] = [`x${i}`, `a${i-10}`];

        // Generate 18-27
        for(let i=18; i<28;i++)
            RegistryWorldSet[`X${i}`] = [`x${i}`, `s${i-16}`];

        // Generate 28-31
        for(let i=28; i<32;i++)
            RegistryWorldSet[`X${i}`] = [`x${i}`, `t${i-25}`];

        return Object.keys(RegistryWorldSet).filter(v => v.startsWith("X"));
    })();

    static __match(world) {
        const keys = this.__keys;
        for(const key of keys) {
            if(Array.from(RegistryWorldSet[key]).includes(world)) {
                return parseInt(`${`${RegistryWorldSet[key][0]}`.slice(1)}`)
            }
        }
    }

}
