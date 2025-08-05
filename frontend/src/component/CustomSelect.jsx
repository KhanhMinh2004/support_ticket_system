import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";


const CustomSelect = ({fullWidth = true, required = true, label, value, onChange, option = [], ...rest}) => {
    return (
        <FormControl
            fullWidth
            required
        >
            <InputLabel>{label}</InputLabel>
            <Select
                variant='outlined'
                value={value}
                onChange={onChange}
                label={label}
                sx = {{borderRadius: "10px", fontSize: "15px"}}
                {...rest}
            >
                {option.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                        {opt}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default CustomSelect;