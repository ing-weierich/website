import { createClient } from '@nextful/api/client';
import { createModule } from '@nextful/packages/module-connector';
import gql from 'graphql-tag';
import ModuleSlider from './ModuleSlider';

const client = createClient();

const Module = createModule({
    typename: 'ModuleSlider',
    component: ModuleSlider,
    async fetch(id: string) {
        const query = gql`
            query moduleSliderById($id: String!) {
                moduleSlider(id: $id) {
                    sys {
                        id
                    }
                    __typename
                    imagesCollection {
                        items {
                            url
                            title
                        }
                    }
                }
            }
        `;

        let moduleData;

        try {
            moduleData = await client.query({
                query: query,
                variables: {
                    id,
                },
            });
        } catch (error) {
            console.log(JSON.stringify(error));
        }

        return moduleData?.data;
    },
});

export default Module;
