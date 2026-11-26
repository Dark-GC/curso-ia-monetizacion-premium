import React from 'react';
import {Button,ProgressBar} from 'react-bootstrap';
import {FiArrowUpRight,FiBookOpen,FiLayers,FiFolder,FiBarChart2,FiZap,FiPackage,FiVideo,FiCompass,FiFileText,FiLink,FiBriefcase,FiCheckSquare} from 'react-icons/fi';
const icons={'Lección':FiBookOpen,'Laboratorio':FiLayers,'Proyecto':FiFolder,'Resultado':FiBarChart2,'Servicios':FiZap,'Productos':FiPackage,'Canales':FiVideo,'Tendencia':FiCompass,'Prompt':FiFileText,'Fuente':FiLink,'Recurso':FiBookOpen,'Evidencia':FiCheckSquare,'Oportunidad':FiBriefcase};
export default function EntityCard({kind,title,description,meta,detail,progress,action,onOpen}){
 const Icon=icons[kind]||FiLayers;
 return <article className="entity-card" data-kind={kind}><div className="entity-top"><span className="entity-symbol" aria-hidden="true"><Icon/></span><span className="entity-kind">{kind}</span></div><h3>{title}</h3><p className="entity-description">{description}</p><div className="entity-meta"><span>{meta}</span>{detail&&<small>{detail}</small>}</div>{typeof progress==='number'&&<div className="entity-progress"><ProgressBar now={progress}/><small>{Math.round(progress)}%</small></div>}<Button variant="outline-light" className="entity-action" onClick={onOpen}>{action}<FiArrowUpRight aria-hidden="true"/></Button></article>;
}
