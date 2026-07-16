import { FilterComponent } from "../features/dashboard/components/tablaRepuestos/FilterComponent"
import { HeaderComponent } from "../features/dashboard/components/tablaRepuestos/HeaderComponent"
import { TableComponent } from "../features/dashboard/components/tablaRepuestos/TableComponent"

export const DashboardView = ()=>{
    return(
        <div className=" w-full min-w-[450px] flex flex-col gap-5">
            <HeaderComponent/>
            <FilterComponent/>
            <TableComponent/>
        </div>
        
    )
}