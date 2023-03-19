import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import css from './styles.module.css';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Content from '../content.json';
import { Locations } from '@src/lib/locations';
import { StorageService, UserMetadata } from '@src/services/storage';
import { storage } from 'webextension-polyfill';

const ALL_CITIES = Array.from(new Set(Locations.map((location) => location.city)));

const storageService = new StorageService();

export function Popup() {
  const [id, setId] = useState('');
  const [phone, setPhone] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [days, setDays] = useState(0);

  const submitEnabled = id && phone && cities.length > 0;

  const initializeMetadata = (metadata: UserMetadata) => {
    const { cities, phone, id } = metadata;
    setId(id);
    setPhone(phone);
    setCities(cities);
  };

  useEffect(() => {
    storageService.getUserMetadata().then((metadata) => {
      if (metadata) {
        initializeMetadata(metadata);
      }
    });
  }, []);

  const start = async () => {
    await storageService.setUserMetadata({ id, phone, cities });
    chrome.tabs.create({
      active: true,
      url: 'https://myvisit.com/#!/home/provider/56',
    });
  };

  return (
    <div className={css.popupContainer}>
      <Box>
        <TextField name="id" value={id} label={Content.idLabel} onChange={(e) => setId(e.target.value)} />
        <TextField name="phone" value={phone} label={Content.phoneLabel} onChange={(e) => setPhone(e.target.value)} />
      </Box>
      <Box>
        <Autocomplete
          multiple
          id="cites-select"
          options={ALL_CITIES}
          value={cities}
          onChange={(_, values) => setCities(values)}
          getOptionLabel={(option) => option}
          noOptionsText={Content.noCitiesFound}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label={Content.citiesLabel}
              placeholder={Content.citiesPlaceholder}
            />
          )}
        />
      </Box>
      <Slider
        aria-label="Volume"
        value={days}
        min={1}
        max={365}
        step={1}
        onChange={(e, value) => setDays(value as number)}
      />
      <Box>
        <Button onClick={start} variant="contained" disabled={!submitEnabled}>
          {Content.searchCta}
        </Button>
      </Box>
    </div>
  );
}
