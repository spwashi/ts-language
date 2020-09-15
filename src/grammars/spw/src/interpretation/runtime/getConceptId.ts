export function getConceptId({domain, label}: { domain: string, label: string }) {
    return `{_${domain.indexOf(' ') > -1 ? `<${domain}>` : domain}_}#${label}`;
}