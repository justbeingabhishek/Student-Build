interface techProp {
  tech : string;
}
const TechStack = ({tech} : techProp) => {
 
  return (
    <div className="text-[12px] px-2 font-semibold rounded-md bg-[#ECEAE3] text-[#3D3A44]">
        {tech}
    </div>
  )
}

export default TechStack