export interface IPropertiesList {
    label: string,
    field: string
}

const WorldPropertiesList: IPropertiesList[] = [
    { label: 'World Name', field: 'name'},
    { label: 'Description', field: 'desc'},
    { label: 'Country', field: 'country'},
    { label: 'Directory', field: 'directory'}
];

export default WorldPropertiesList;

