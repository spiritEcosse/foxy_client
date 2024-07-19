import React, {useContext, useEffect, useState} from 'react';
import {Autocomplete, TextField} from '@mui/material';
import {AddressType, CountryType} from '../types';
import {fetchData} from '../utils';
import {AddressContext} from './AddressContext';
import {UserContext} from './UserContext';
import {useError} from './ErrorContext';

const AddressForm = () => {
    const {address, setAddress, setAddressAndStore, updateAddressField} = useContext(AddressContext);
    const {user, setUserAndStore} = useContext(UserContext);
    const [countries, setCountries] = useState<CountryType[]>([]);
    const {setErrorMessage} = useError();

    const fetchDataAndUpdateState = async () => {
        try {
            const countriesData = await fetchData('', 'country?limit=100', 'GET');
            setCountries(countriesData.data);

            if (user && !address) {
                const addressData = await fetchData('', `address?user_id=${user.id}`, 'GET', {}, true);
                if (addressData.data.length) {
                    setAddressAndStore(addressData.data[0]);
                }
            }
        } catch (error) {
            setErrorMessage(`Error fetching data: ${error}`);
        }
    };

    useEffect(() => {
        fetchDataAndUpdateState();
    }, [fetchDataAndUpdateState]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateAddressField(event.target.name as keyof AddressType, event.target.value);
    };

    return (
        <div>
            <Autocomplete
                id="country-search"
                options={countries}
                fullWidth
                value={countries.find(country => country.id === address?.country_id) || null}
                renderInput={(params) => <TextField {...params} required label="Country"
                    variant="outlined"/>}
                onChange={(event, newValue) => {
                    updateAddressField('country_id', newValue?.id);
                    updateAddressField('country', newValue);
                }}
                getOptionLabel={(option: CountryType) => option.title}
                style={{width: '100%'}}
            />
            <TextField
                name="city"
                label="City"
                margin={'normal'}
                fullWidth
                value={address?.city || ''}
                onChange={handleChange}
                required
            />
            <TextField
                name="address"
                label="Address"
                margin={'normal'}
                fullWidth
                value={address?.address || ''}
                onChange={handleChange}
                required
            />
            <TextField
                name="zipcode"
                label="Zipcode"
                margin={'normal'}
                fullWidth
                value={address?.zipcode || ''}
                onChange={handleChange}
                required
            />
        </div>
    );
};

export default AddressForm;
