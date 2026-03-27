# DNS Setup for pagepulse.eu

## Vercel DNS Configuration

Add these records to your domain registrar's DNS settings for `pagepulse.eu`:

### Root Domain (`pagepulse.eu`)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | `76.76.21.21` | 3600 |

### WWW Subdomain (`www.pagepulse.eu`)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | `cname.vercel-dns.com` | 3600 |

## Steps

1. **Add domain in Vercel:**
   - Go to your Vercel project → Settings → Domains
   - Add `pagepulse.eu`
   - Vercel will show you the required DNS records

2. **Configure DNS at your registrar:**
   - Log into your domain registrar (Namecheap, Cloudflare, GoDaddy, etc.)
   - Navigate to DNS management for `pagepulse.eu`
   - Add the A record and CNAME record listed above
   - Remove any conflicting records (existing A or CNAME for @ or www)

3. **SSL Certificate:**
   - Vercel automatically provisions and renews SSL certificates via Let's Encrypt
   - No manual action required — HTTPS will be active once DNS propagates

4. **Verification:**
   - DNS propagation can take up to 48 hours (usually 5-30 minutes)
   - Check propagation: `dig pagepulse.eu` or use [dnschecker.org](https://dnschecker.org)
   - Vercel dashboard will show a green checkmark when the domain is active

## Notes

- If using Cloudflare as your registrar, set the proxy status to **DNS only** (gray cloud) for the A record, so Vercel can manage SSL.
- The `www` subdomain will automatically redirect to the root domain (or vice versa) based on your Vercel project settings.
