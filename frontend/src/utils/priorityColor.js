export const getPriorityColor = (priority) => {
    switch (priority) {
        case 'High':
            return '#e53935';
        case 'Medium':
            return '#fb8c00';
        case 'Low':
            return '#43a047';
        default:
            return '#9e9e9e';
    }
};
