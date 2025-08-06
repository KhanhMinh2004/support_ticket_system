import TextField from '@mui/material/TextField'

const CustomTextField = ({label, value, onChange, fontSize = "15px", ...rest}) => {
    return (
        <TextField
            label={label}
            fullWidth
            required
            value={value}
            onChange={onChange}
            InputProps={{
                style: {
                    fontSize: fontSize,
                    borderRadius: "10px",
                },
            }}
            {...rest}
        />
    );
};

export default CustomTextField;