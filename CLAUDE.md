# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AWS CDK TypeScript project that deploys foundational infrastructure across multiple AWS accounts. The primary purpose is to standardize account setup with GitHub Actions authentication, Identity Center SSO, Terraform state buckets, and cross-account role management.

## Common Commands

### Build and Development
- `yarn build` - Compile TypeScript to JavaScript
- `yarn lint` - Check code formatting with Prettier
- `cdk synth` - Synthesize CloudFormation templates
- `cdk diff` - Show differences between current state and code
- `cdk deploy --all` - Deploy all stacks (requires AWS credentials)

### Deployment Commands
- `yarn bootstrap` - Deploy using `cdk-deploy` profile (standard deployment)
- `yarn bootstrap:admin` - Deploy using `admin` profile (admin access required)
- `yarn deploy` - Deploy without approval prompts

## Architecture

### Account Structure
The project manages two AWS accounts defined in `accounts.ts`:
- **Management Account** (`858777967843`) - Contains Identity Center, main GitHub auth, SSO setup
- **AllianceBook Account** (`552800114493`) - Secondary account with shared resources

### Stack Architecture
Each stack has a specific purpose and deployment target:

**Management Account Stacks:**
- `AwsAccountIdentityCenterStack` - Sets up SSO permission sets and user assignments
- `AwsAccountGithubStack` - Creates GitHub Actions OIDC provider and roles for CI/CD
- `AwsAccountRolesStack` - Standard cross-account roles (admin, cdk-deploy)  
- `AwsAccountTerraformStack` - S3 bucket for Terraform state storage
- `AwsSSOStack` - Cognito User Pool for custom SSO with cross-account sharing

**Cross-Account Stacks:**
- Account-specific versions of roles and Terraform stacks are deployed to secondary accounts
- Stacks use account ID suffixes for uniqueness (e.g., `AwsAccountRoles-552800114493`)

### Key Components

**GitHub Integration (`AwsAccountGithubStack.ts:24-93`)**
- Creates OIDC provider for GitHub Actions authentication
- Two roles: `github-actions-cdk` (CDK deployment) and `github-actions-admin` (full access)
- Scoped to repositories under the `mjwbenton` GitHub username

**Cross-Account Access (`AwsAccountRolesStack.ts:17-53`)**
- `admin` role with full AWS access for cross-account management
- `cdk-deploy` role with CDK-specific permissions for automated deployments
- Trust relationships configured via `trustAccountIds` prop

**SSO Setup (`AwsSSOStack.ts:12-92`)**
- Cognito User Pool with custom domain prefix `mattb-sso`
- Parameters stored in SSM and shared via Resource Access Manager
- Callback URLs configured for specific applications

## Development Notes

### Configuration Files
- `cdk.json` - CDK app entry point (`ts-node src/index.ts`)
- `tsconfig.json` - Extends `@tsconfig/recommended` with `src/` to `dist/` compilation
- Account IDs and configuration are centralized in `accounts.ts`

### Stack Props Pattern
Most stacks accept custom props extending `StackProps`:
- Account targeting via `assumeAccountIds`, `trustAccountIds`, `shareAccountIds`
- Resource naming via `bucketName`, `callbackUrls`
- Cross-stack dependencies managed through constructor props

### Deployment Strategy
- Management account contains the central infrastructure
- Secondary accounts receive minimal stacks (roles + Terraform bucket)
- Resource sharing via AWS RAM for SSO parameters
- Profile-based deployment supports different permission levels