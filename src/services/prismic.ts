import * as prismic from '@prismicio/client'

export const repositoryName = 'ignews-nana'

export function getPrismicClient() {
  return prismic.createClient(repositoryName, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });
}
