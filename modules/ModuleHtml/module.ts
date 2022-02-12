import { createClient } from '@nextful/api/client';
import { createModule } from '@nextful/packages/module-connector';
import gql from 'graphql-tag';
import ModuleHtml from './ModuleHtml';

const client = createClient();

const Module = createModule({
    typename: 'ModuleHtml',
    component: ModuleHtml,
    async fetch(id: string) {
        const query = gql`
            query moduleHtmlById($id: String!) {
                moduleHtml(id: $id) {
                    sys {
                        id
                    }
                    __typename
                    html
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
