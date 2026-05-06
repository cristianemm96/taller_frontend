export const HeaderComponent = ()=>{
    return(
        <div className="flex">
            <div>
                <h1>Taller mecanico</h1>
            </div>
            <div className="flex gap-7">
                <div className="flex flex-col items-center">
                    <div>
                        <h3>Total de componentes</h3>
                    </div>
                    <div>
                        <p>15500</p>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div>
                        <h3>Stock bajos</h3>
                    </div>
                    <div>
                        <p>30</p>
                    </div>
                </div>
            </div>
        </div>
    )
}