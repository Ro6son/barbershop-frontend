import { useForm } from 'react-hook-form';
import { Header } from '../../components/Header';
import { InputSchedule } from '../../components/InputSchedule';
import style from './Schedules.module.css';
import { useAuth } from '../../hooks/auth';

import { formatISO, getHours, parseISO, setHours } from 'date-fns';
import { api } from '../../server';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Define a interface para os valores do formulário
interface IFormValues {
  date: string;
  name: string;
  phone: string;
  hour: string;
}

// Componente de Agendamento
export function Schedules() {

  // Define o schema de validação com Yup
  const schema = yup.object().shape({
    phone: yup.string().required('Campo de telefone obrigatório'),
    name: yup.string().required('Campo de Nome obrigatório'),
    date: yup.string().required('Campo de data obrigatório'),
    hour: yup.string().required('Campo de hora obrigatório'),
  });

   // Utiliza o hook useForm para gerenciar o estado do formulário e validação
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormValues>({
    resolver: yupResolver(schema),
  });

  // Utiliza o hook useAuth para obter dados de autenticação
  const { availableSchedules, schedules, handleSetDate } = useAuth();

  // Utiliza o hook useNavigate para navegação
  const navigate = useNavigate();

  // Obtém a data atual no formato ISO
  const currentValue = new Date().toISOString().split('T')[0];

  // Filtra os horários disponíveis baseados nas agendas existentes
  const filteredDate = availableSchedules.filter((hour) => {
    const isScheduleAvailable = !schedules.find((scheduleItem) => {
      const scheduleDate = new Date(scheduleItem.date);
      const scheduleHour = getHours(scheduleDate);
      return scheduleHour === Number(hour);
    });
    return isScheduleAvailable;
  });

  // Função de submissão do formulário
  const submit = handleSubmit(async ({ name, phone, date, hour }) => {

    // Formata a data e hora para ISO
    const formattedDate = formatISO(setHours(parseISO(date), parseInt(hour)));

    // Faz uma requisição POST para criar um agendamento
    try {
      const result = await api.post(`/schedules/`, {
        name,
        phone,
        date: formattedDate,
      });
      console.log('🚀 ~ file: index.tsx:34 ~ submit ~ result:', result);
      toast.success('Atualizado com sucesso');

      // Redireciona para o dashboard após o agendamento
      navigate('/dashboard');
    } catch (error) {
      // Lida com erros da requisição
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  });

  // Renderiza o componente de Agendamento
  return (
    <div className={`${style.container} container`}>
      <Header />
      <h2>Agendamento de Horário</h2>
      <div className={style.formDiv}>
        <form onSubmit={submit}>

           {/* Componente InputSchedule para nome */}
          <InputSchedule
            placeholder="Nome do cliente"
            type="text"
            {...register('name', { required: true })}
            error={errors.name && errors.name.message}
          />
          {/* Componente InputSchedule para telefone */}
          <InputSchedule
            placeholder="Celular"
            type="text"
            {...register('phone', { required: true })}
            error={errors.phone && errors.phone.message}
          />
          <div className={style.date}>
            {/* Componente InputSchedule para data */}
            <InputSchedule
              placeholder="Dia"
              type="date"
              {...register('date', {
                required: true,
                value: currentValue,
                onChange: (e) => handleSetDate(e.target.value),
              })}
              error={errors.date && errors.date.message}
            />
            <div className={style.select}>
              <label htmlFor="">Hora</label>
              {/* Dropdown de seleção para horário */}
              <select
                {...register('hour', {
                  required: true,
                })}
              >
                {filteredDate.map((hour, index) => {
                  return (
                    <option value={hour} key={index}>
                      {hour}:00
                    </option>
                  );
                })}
              </select>
              {errors.hour && <span>{errors.hour.message}</span>}
            </div>
          </div>

          <div className={style.footer}>
            <button>Cancelar</button>
            <button>Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/*
O objetivo deste código é criar um componente de agendamento em uma aplicação React. O componente "Schedules" permite aos usuários
agendar horários com informações como nome, telefone, data e hora. O código também lida com a validação dos campos de entrada usando
a biblioteca Yup, filtra os horários disponíveis para agendamento com base nas agendas existentes e realiza a criação de um novo
agendamento através de uma requisição POST para a API.

*/