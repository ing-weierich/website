import { createClient } from '@nextful/api/client';
import { createModule } from '@nextful/packages/module-connector';
import gql from 'graphql-tag';
import ModuleText from './ModuleText';

const client = createClient();

const Module = createModule({
    typename: 'ModuleText',
    component: ModuleText,
    async fetch(id: string) {
        const query = gql`
            query moduleTextById($id: String!) {
                moduleText(id: $id) {
                    sys {
                        id
                    }
                    __typename
                    headline
                    topline
                    buttonLabel
                    buttonLink {
                        slug
                    }
                    text {
                        json
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
