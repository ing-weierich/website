import { createClient } from '@nextful/api/client';
import { createModule } from '@nextful/packages/module-connector';
import gql from 'graphql-tag';
import ModuleImageText from './ModuleImageText';

const client = createClient();

const Module = createModule({
    typename: 'ModuleImageText',
    component: ModuleImageText,
    async fetch(id: string) {
        const query = gql`
            query moduleImageTextById($id: String!) {
                moduleImageText(id: $id) {
                    sys {
                        id
                    }
                    __typename
                    headline
                    image {
                        url
                        width
                        height
                        title
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
