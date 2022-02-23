import Axios from "axios";
import { CreateGameResponse } from "pages/api/game";
import { GetScenarioResponse } from "pages/api/scenario";
import useSWR from "swr";

const fetcher = (url: string, params: { [key: string]: any } = {}) => Axios.get(url, { params }).then(res => res.data);

export function useScenarios() {
    const { data, error } = useSWR<GetScenarioResponse>(`/api/scenario`, fetcher, { refreshInterval: 30000 });

    return {
        scenarios: data,
        error,
        isLoading: !error && !data,
        isError: !!error,
        createGame: async (scenarioId: number): Promise<string> => {
            const response = await Axios.post<CreateGameResponse>('/api/game', {scenarioId});

            return response.data.id;
        }
    }
}
