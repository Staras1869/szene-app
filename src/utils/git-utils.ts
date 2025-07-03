/**
 * Utility functions for Git operations
 */

/**
 * Converts an HTTPS Git URL to SSH format
 * @param httpsUrl - The HTTPS URL to convert
 * @returns The equivalent SSH URL
 */
export function convertHttpsToSsh(httpsUrl: string): string {
  // Check if it's already an SSH URL
  if (httpsUrl.startsWith("git@")) {
    return httpsUrl
  }

  // Extract the important parts from the HTTPS URL
  const match = httpsUrl.match(/https:\/\/([^/]+)\/(.+)\.git$/)
  if (!match) {
    throw new Error("Invalid HTTPS Git URL format")
  }

  const [, domain, path] = match
  return `git@${domain}:${path}.git`
}

/**
 * Converts an SSH Git URL to HTTPS format
 * @param sshUrl - The SSH URL to convert
 * @returns The equivalent HTTPS URL
 */
export function convertSshToHttps(sshUrl: string): string {
  // Check if it's already an HTTPS URL
  if (sshUrl.startsWith("https://")) {
    return sshUrl
  }

  // Extract the important parts from the SSH URL
  const match = sshUrl.match(/git@([^:]+):(.+)\.git$/)
  if (!match) {
    throw new Error("Invalid SSH Git URL format")
  }

  const [, domain, path] = match
  return `https://${domain}/${path}.git`
}

/**
 * Checks if the provided string is a valid Git URL
 * @param url - The URL to validate
 * @returns True if the URL is a valid Git URL
 */
export function isValidGitUrl(url: string): boolean {
  const httpsPattern = /^https:\/\/[^/]+\/[^/]+\/[^/]+\.git$/
  const sshPattern = /^git@[^:]+:[^/]+\/[^/]+\.git$/

  return httpsPattern.test(url) || sshPattern.test(url)
}
