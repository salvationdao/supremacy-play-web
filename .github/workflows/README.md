# Github Actions

## Build and Staging Deployment

### Required Secrets

```sh
# Secret Keys, Available in password manager
NINJA_NPM_TOKEN

# Deployment target
STAGING_SSH_HOST # The host name of the target
STAGING_SSH_KNOWN_HOSTS # ssh-keyscan -t ED25519 -p STAGING_SSH_PORT STAGING_SSH_HOST | tee github-key-temp | ssh-keygen -lf -
STAGING_SSH_PKEY
STAGING_SSH_PORT
STAGING_SSH_USER
```

### Jobs

#### Build

1. Use `npm ci` to get dependencies.

2. Use npm built-in to increment version (`npm version prerelease --allow-same-version --preid rc`).

3. Build web

4. Push new version to github.

5. Save build output to github actions.

#### Deploy

1. Wait for build to finish.

2. Retrive build output from previous job.

3. Set up ssh config using the deployment target secrets.

4. Rsync the files to `/usr/share/supremacy/supremacy-stream-site_${{env.GITVERSION}}`

5. Update the `supremacy-stream-site_online` symbolic link to the new version

6. Test nginx and reload
