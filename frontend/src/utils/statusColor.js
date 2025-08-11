export const getStatusColor = (status) => {
    switch (status) {
        case 'Open':
            return 'error';
        case 'Pending':
            return 'warning';
        case 'Resolved':
            return 'success';
        default:
            return 'default';
    }
}