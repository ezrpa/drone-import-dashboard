# Security Guidelines

## Environment Variables

**IMPORTANT**: This project uses environment variables to store sensitive API keys and tokens. Follow these security practices:

### Local Development

1. **Never commit `.env` files** - They are already in `.gitignore`
2. **Use `.env.example` as template**:
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```
3. **Keep tokens secure** - Only share with authorized team members

### Production Deployment

#### GitHub Pages (Current Setup)
Since GitHub Pages only serves static files, environment variables are **built into the bundle**. For production:

1. **Use GitHub Secrets** for sensitive values
2. **Set up GitHub Actions** with proper environment variable injection
3. **Consider moving to a more secure hosting platform** for production

#### Recommended Production Hosting
For better security, consider these alternatives:

- **Vercel**: Built-in environment variable support
- **Netlify**: Secure environment variable management  
- **AWS Amplify**: Enterprise-grade security
- **Firebase Hosting**: Google Cloud security

### API Keys Security

#### Supabase
- **Anon Key**: Safe to expose (read-only, RLS protected)
- **Service Role Key**: **NEVER expose** - backend only
- **URL**: Safe to expose (public endpoint)

#### eBay API
- **App ID**: Safe to expose (public identifier)
- **Dev ID**: Safe to expose (public identifier)  
- **Cert ID**: **KEEP SECURE** - acts as password

### Current Security Status

✅ **Fixed**: Removed hardcoded tokens from source code  
✅ **Fixed**: Environment variables properly configured  
✅ **Active**: .env file excluded from git  
⚠️ **Warning**: GitHub Pages builds tokens into static files  

### Security Incident Response

If tokens are exposed:

1. **Immediate**: Revoke/rotate affected API keys
2. **Supabase**: Reset service role key in dashboard
3. **eBay**: Generate new Cert ID in developer console  
4. **Git**: Remove from history if committed

### Monitoring

- **GitGuardian**: Monitors for exposed secrets
- **GitHub Security**: Dependency vulnerability scanning
- **Manual Review**: Regular code review for hardcoded values

### Best Practices

1. **Principle of Least Privilege**: Use minimal required permissions
2. **Regular Rotation**: Rotate API keys quarterly
3. **Environment Separation**: Different keys for dev/staging/prod
4. **Logging**: Monitor API usage for anomalies
5. **HTTPS Only**: All API calls over secure connections

### Contact

For security concerns or to report vulnerabilities, please create a private issue in the GitHub repository.