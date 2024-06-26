import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Field, useFormikContext } from 'formik';
import FormField from './Field';

const LocationSelect = ({ initialData }) => {
  const { setFieldValue } = useFormikContext();
  const [data, setData] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json");
      setData(result.data);
      setCities(result.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (initialData.address) {

      const provinceId = initialData.address.province;
      const province = data.find(province => province.Id === provinceId);
      setDistricts(province ? province.Districts : []);
      setWards([]);
      setFieldValue('address.province', provinceId); // Changed from 'address.province'
      const districtId = initialData.address.district;
      const district = districts.find(district => district.Id === districtId);
      setWards(district ? district.Wards : []);
      setFieldValue('address.district', districtId);
      const wardId = initialData.address.ward;
      setFieldValue('address.ward', wardId);

    }
  }, [initialData, data, districts]);

  const handleprovinceChange = (event) => {
    const provinceId = event.target.value;
    const province = data.find(province => province.Id === provinceId);
    setDistricts(province ? province.Districts : []);
    setWards([]);
    setFieldValue('address.province', provinceId); // Changed from 'address.province'
    setFieldValue('address.district', '');
    setFieldValue('address.ward', '');
  };

  const handleDistrictChange = (event) => {
    const districtId = event.target.value;
    const district = districts.find(district => district.Id === districtId);
    setWards(district ? district.Wards : []);
    setFieldValue('address.district', districtId);
    setFieldValue('address.ward', '');
  };

  const handleWardChange = (event) => {
    const wardId = event.target.value;
    setFieldValue('address.ward', wardId);
  };
  return (
    <FormField>
      <Field as="select" name="address.province" onChange={handleprovinceChange}>
        <option value="">Chọn tỉnh thành</option>
        {cities.map(province => (
          <option key={province.Id} value={province.Id}>{province.Name}</option>
        ))}
      </Field>

      <Field as="select" name="address.district" onChange={handleDistrictChange}>
        <option value="">Chọn quận huyện</option>
        {districts.map(district => (
          <option key={district.Id} value={district.Id}>{district.Name}</option>
        ))}
      </Field>

      <Field as="select" name="address.ward" onChange={handleWardChange}>
        <option value="">Chọn phường xã</option>
        {wards.map(ward => (
          <option key={ward.Id} value={ward.Id}>{ward.Name}</option>
        ))}
      </Field>
    </FormField>
  );
};

export default LocationSelect;