export function isIPv4AndIsIpv6(value, Ipv4, Ipv6, fqdn) {
  if (Ipv4.test(value) || Ipv6.test(value) || fqdn.test(value)) {
    return true;
  } else {
    return false;
  }
}
