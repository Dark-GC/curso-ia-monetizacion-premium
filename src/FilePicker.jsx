import React,{useId} from 'react';
import {FiUpload} from 'react-icons/fi';
export default function FilePicker({label,onChange}){
 const id=useId();
 return <div className="os-file-picker"><input className="visually-hidden" id={id} aria-label={label} type="file" accept=".json,application/json" onChange={onChange}/><label htmlFor={id} className="os-file-action"><FiUpload aria-hidden="true"/><span>{label}</span></label><small>Archivo JSON · seleccionar desde tu dispositivo</small></div>;
}
