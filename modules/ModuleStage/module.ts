import { createClient } from '@nextful/api/client';
import { createModule } from '@nextful/packages/module-connector';
import gql from 'graphql-tag';
import ModuleStage from './ModuleStage';

const client = createClient();

const Module = createModule({
    typename: 'ModuleStage',
    component: ModuleStage,
    async fetch(id: string) {
        const query = gql`
            query moduleStageById($id: String!) {
                moduleStage(id: $id) {
                    sys {
                        id
                    }
                    __typename
                    headline
                    subheadline
                    image {
                        url
                        title
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
