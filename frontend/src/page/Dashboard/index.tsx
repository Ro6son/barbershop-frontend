import { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { useAuth } from '../../hooks/auth';
import style from './Dashboard.module.css';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ptBR } from 'date-fns/locale';
import { format, isToday } from 'date-fns';
import { api } from '../../server';

// Define uma interface para os objetos de agendamento, que incluem informações como nome, telefone, data e ID.
interface ISchedule {
  name: string;
  phone: string;
  date: Date;
  id: string;
}

// Componente de Dashboard
export function Dashboard() {

  // Estado para armazenar a data selecionada
  const [date, setDate] = useState(new Date());

  // Estado para armazenar os horários agendados
  const [schedules, setSchedules] = useState<Array<ISchedule>>([]);

  // Obtém os dados do usuário autenticado do contexto
  const { user } = useAuth();
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };
  const isWeeDay = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  // Atualiza o estado da data quando o usuário seleciona uma nova data no calendário
  const handleDataChange = (date: Date) => {
    setDate(date);
  };

   // Efeito de lado para buscar os horários agendados da API com base na data selecionada
  useEffect(() => {
    api
      .get('/schedules', {
        params: {
          date,
        },
      })
      .then((response) => {
        // Atualiza o estado dos horários com os dados obtidos da API
        setSchedules(response.data);
      })
      // O efeito é acionado sempre que a data selecionada muda
      .catch((error) => console.log(error));
  }, [date]);


  return (
    <div className="container">
      <Header />
      <div className={style.dataTitle}>
        <h2>Bem vindo, {user.name} </h2>
        <p>
          Esta é sua lista de horários {isToday(date) && <span>de hoje, </span>}
          dia {format(date, 'dd/MM/yyy')}
        </p>
      </div>
      <h2 className={style.nextSchedules}>Próximos Horários</h2>
      <div className={style.schedule}>
        <div className={style.cardWrapper}>

          {/* Mapeia os horários agendados e renderiza um componente Card para cada um */}
          {schedules.map((schedule, index) => {
            return (
              <Card
                key={index}
                date={schedule.date}
                name={schedule.name}
                id={schedule.id}
                phone={schedule.phone}
              />
            );
          })}
        </div>
        <div className={style.picker}>

          {/* Componente DayPicker para selecionar a data */}
          <DayPicker
            className={style.calendar}
            classNames={{
              day: style.day,
            }}
            selected={date}
            modifiers={{ available: isWeeDay }}
            mode="single"
            modifiersClassNames={{
              selected: style.selected,
            }}
            fromMonth={new Date()}
            locale={ptBR}
            disabled={isWeekend}
            onDayClick={handleDataChange}
          />
        </div>
      </div>
    </div>
  );
}

/*
Este código implementa o componente de dashboard, proporcionando aos usuários autenticados uma visão de seus horários agendados.
Em resumo, este componente de dashboard proporciona aos usuários uma visão clara e organizada de seus horários agendados. 
Através da integração com a API, os horários são atualizados dinamicamente com base nas datas selecionadas, melhorando a experiência
do usuário.

*/
