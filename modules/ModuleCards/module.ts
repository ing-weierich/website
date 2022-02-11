import { createClient } from '@nextful/api/client';
import { createModule } from '@nextful/packages/module-connector';
import gql from 'graphql-tag';
import ModuleCards from './ModuleCards';

const client = createClient();

const Module = createModule({
    typename: 'ModuleCards',
    component: ModuleCards,
    async fetch(id: string) {
        const query = gql`
            query moduleCardsById($id: String!) {
                moduleCards(id: $id) {
                    sys {
                        id
                    }
                    __typename
                    cardsCollection {
                        items {
                            image {
                                url
                                width
                                height
                                title
                            }
                            headline
                            text {
                                json
                            }
                        }
                    }
                }
            }
        `;

        const moduleData = await client.query({
            query: query,
            variables: {
                id,
            },
        });

        return moduleData.data;
    },
});

export default Module;
