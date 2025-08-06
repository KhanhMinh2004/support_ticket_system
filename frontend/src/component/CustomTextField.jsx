import TextField from '@mui/material/TextField'

const CustomTextField = ({label, value, onChange, ...rest}) => {
    return (
        <TextField
            label={label}
            fullWidth
            required
            value={value}
            onChange={onChange}
            InputProps={{
                style: {
                    fontSize: "15px",
                    borderRadius: "10px",
                },
            }}
            {...rest}
        />
    );
};

export default CustomTextField;