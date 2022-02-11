import { createClient } from '@nextful/api/client';
import { createModule } from '@nextful/packages/module-connector';
import gql from 'graphql-tag';
import ModuleAkkordeons from './ModuleAkkordeons';

const client = createClient();

const Module = createModule({
    typename: 'ModuleAkkordeons',
    component: ModuleAkkordeons,
    async fetch(id: string) {
        const query = gql`
            query moduleAkkordeonsById($id: String!) {
                moduleAkkordeons(id: $id) {
                    sys {
                        id
                    }
                    __typename
                    headline
                    accordeonsCollection {
                        items {
                            label
                            text {
                                json
                            }
                            title
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
