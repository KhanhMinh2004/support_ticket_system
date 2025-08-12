export const getStatusColor = (status) => {
    switch (status) {
        case 'Open':
            return 'error';
        case 'In Progress':
            return 'warning';
        case 'Resolved':
            return 'success';
        default:
            return 'default';
    }
}