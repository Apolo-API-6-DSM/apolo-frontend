'use client';
import Input from "@components/Input"
import { Button } from "@components/Button"
import { ActionsDrodown } from "@components/ActionsDropdown";
import { RiSearch2Line } from "react-icons/ri"
import { Dialog } from "@components/Dialog";
import { ChamadoListagem } from "@lib/models/Chamado"
import { useContext, useEffect, useState } from "react"
import chamadoRequests from "@services/requests/chamadoRequests";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiltroChamadoSchema, filtroChamadoSchema } from "@lib/validations/chamado/filtroChamadoSchema";
import { useRouter } from "next/navigation";
import { ToastContext } from "@contexts/ToastContext";

export default function ListagemChamado() {
    const [chamados, setChamados] = useState<ChamadoListagem[]>([]);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [key, setKey] = useState(0);
    const [filterSubmitted, setFilterSubmitted] = useState<FiltroChamadoSchema | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [chamadoIdDelete, setChamadoIdDelete] = useState<number | null>(null);
    const hasMorePages = pagina < totalPaginas;

    const { addToast } = useContext(ToastContext)
    const router = useRouter();

    const { register, handleSubmit, formState: { errors }, getValues } = useForm<FiltroChamadoSchema>({
        resolver: zodResolver(filtroChamadoSchema)
    });

    useEffect(() => {
        const filter = filterSubmitted || {};
        chamadoRequests
            .get({ pagina, tamanhoPagina: 10, ...filter })
            .then((response) => {
                const { chamados, quantidadePaginas } = response.data;
                setChamados(chamados);
                setTotalPaginas(quantidadePaginas);
            })
            .finally(() => setIsLoading(false));
    }, [pagina, key, getValues, filterSubmitted]);

    function handleFiltroChamado(data: FiltroChamadoSchema) {
        setFilterSubmitted(data);
        setKey(prev => prev + 1);

        if (pagina !== 1) {
            setPagina(1);
        }
    }

    return (
        <>
            <div className="bg-bg-100 p-4 rounded-md drop-shadow">
                <h1 className="text-text-on-background text-base font-medium">Gerenciamento de Chamados</h1>
            </div>
            <form onSubmit={handleSubmit(handleFiltroChamado)} className="bg-bg-100 p-4 rounded-md drop-shadow flex gap-4">
                <Input width="w-60" placeholder="Status:" {...register("status")} error={errors.status?.message} />
                <Input width="w-60" placeholder="Responsável:" {...register("responsavel")} error={errors.responsavel?.message} />
                <Input width="w-60" placeholder="Sentimento:" {...register("sentimento")} error={errors.sentimento?.message} />
                <Button text="Filtrar" variant="ghost" type="submit" Icon={RiSearch2Line} iconPosition="left" />
            </form>
            <div className="flex flex-col gap-2 w-fit h-fit">
                <div className="bg-bg-100 px-4 py-4 rounded-md drop-shadow w-fit">
                    <table className="w-fit">
                        <thead className="text-text-on-background-disabled text-sm font-semibold border-b-2 border-text-on-background-disabled">
                            <tr>
                                <th className="p-4 text-left">ID</th>
                                <th className="p-4 text-left">TÍTULO</th>
                                <th className="p-4 text-left">DESCRIÇÃO</th>
                                <th className="p-4 text-left">STATUS</th>
                                <th className="p-4 text-center">AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody className="text-text-on-background font-medium">
                            {chamados.map((chamado, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-4 w-24 max-w-24 truncate">{chamado.idChamado}</td>
                                    <td className="px-4 w-80 max-w-80 truncate">{chamado.titulo}</td>
                                    <td className="px-4 w-80 max-w-80 truncate">{chamado.descricao}</td>
                                    <td className="px-4 w-40 max-w-40 truncate">{chamado.status}</td>
                                    <td className="px-4 w-24 max-w-24 text-center">
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {isLoading && <span className="text-text-on-background font-medium">Carregando...</span>}
                </div>
                <div className="flex justify-end">
                    <div className="bg-bg-100 w-fit px-2 py-2 rounded-md drop-shadow flex gap-2 items-center justify-items-end">
                        <Button text="Anterior" variant="ghost" onClick={() => setPagina(pagina - 1)} disabled={pagina <= 1} />
                        <span className="text-text-on-background font-medium">{pagina} de {totalPaginas}</span>
                        <Button text="Próximo" variant="ghost" onClick={() => setPagina(pagina + 1)} disabled={!hasMorePages} />
                    </div>
                </div>
            </div>
        </>
    )
}
