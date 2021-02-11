export function getConceptId(domain: string, ...label: string[]) {
    return (
        [domain, ...label]
            .reduce(
                (prev, curr, i, arr) => {
                    if (i === arr.length - 1) {
                        return prev + '#' + curr;
                    }
                    return `{_${curr.indexOf(' ') > -1 ? `<${curr}>` : curr}_}`
                },
            )
    );
}