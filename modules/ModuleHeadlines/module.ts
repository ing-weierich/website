import { createClient } from '@nextful/api/client';
import { createModule } from '@nextful/packages/module-connector';
import gql from 'graphql-tag';
import ModuleHeadlines from './ModuleHeadlines';

const client = createClient();

const Module = createModule({
    typename: 'ModuleHeadlines',
    component: ModuleHeadlines,
    async fetch(id: string) {
        const query = gql`
            query moduleHeadlinesById($id: String!) {
                moduleHeadlines(id: $id) {
                    sys {
                        id
                    }
                    __typename
                    headline
                    subheadline
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
