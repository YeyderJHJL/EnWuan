import { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  useDisclosure,
  Chip
} from '@nextui-org/react';
import { Wallet, TrendingUp, ArrowUpRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { submissionsService, analyticsService } from '../../services/api';

export default function WalletCard() {
  const { firebaseUser } = useAuth();
  const [balance, setBalance] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [showBalance, setShowBalance] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [withdrawForm, setWithdrawForm] = useState({
    amount: '',
    method: 'paypal',
    account: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBalance();
  }, [firebaseUser]);

  const loadBalance = async () => {
    try {
      // Obtener estadísticas del usuario
      const dashboardRes = await analyticsService.getUserDashboard();
      if (dashboardRes.data) {
        setEarnings(dashboardRes.data.totalEarnings || 0);
        setBalance(dashboardRes.data.totalEarnings || 0); // Para MVP, balance = earnings
      }

      // Alternativa: obtener de submissions del usuario
      const submissionsRes = await submissionsService.getSubmissionsByUser(firebaseUser.uid);
      if (submissionsRes.data) {
        const totalEarned = submissionsRes.data.reduce((sum, s) => sum + (s.rewardGiven || 0), 0);
        setBalance(totalEarned);
        setEarnings(totalEarned);
      }
    } catch (error) {
      console.error('Error al cargar saldo:', error);
    }
  };

  const handleWithdraw = async () => {
    setError('');
    
    const amount = parseFloat(withdrawForm.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Ingresa un monto válido');
      return;
    }
    
    if (amount > balance) {
      setError('Saldo insuficiente');
      return;
    }
    
    if (amount < 10) {
      setError('El monto mínimo de retiro es S/. 10.00');
      return;
    }

    setLoading(true);

    try {
      // Simulación: en MVP, solo guardamos como pendiente
      console.log('Solicitud de retiro:', {
        userId: firebaseUser.uid,
        amount: amount,
        method: withdrawForm.method,
        account: withdrawForm.account,
      });

      onOpenChange();
      setWithdrawForm({
        amount: '',
        method: 'paypal',
        account: '',
      });
      
      alert('✓ Solicitud de retiro enviada! Será procesada en 24-48 horas.');
    } catch (err) {
      setError('Error al procesar la solicitud');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-[#0764bf] to-[#1800ad] border-none shadow-xl">
        <CardHeader className="flex justify-between items-center pb-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Wallet className="text-white" size={20} />
            </div>
            <div>
              <span className="text-white font-semibold block">Mi Billetera</span>
              <span className="text-white/70 text-xs">Ganancias totales</span>
            </div>
          </div>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onClick={() => setShowBalance(!showBalance)}
          >
            {showBalance ? <Eye className="text-white" size={18} /> : <EyeOff className="text-white" size={18} />}
          </Button>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div>
              <p className="text-white/80 text-sm">Saldo Disponible</p>
              <p className="text-4xl font-bold text-white">
                {showBalance ? `S/ ${balance.toFixed(2)}` : 'S/ ****'}
              </p>
            </div>
            
            <div className="flex gap-2 text-sm">
              <div className="flex items-center gap-1 text-white/80">
                <TrendingUp size={16} />
                <span>Este mes: S/ {earnings.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-white text-[#0764bf] font-semibold hover:bg-gray-100"
                startContent={<ArrowUpRight size={18} />}
                onClick={onOpen}
                isDisabled={balance < 10}
              >
                Retirar
              </Button>
              <Button
                variant="bordered"
                className="text-white border-white/30 hover:bg-white/10"
                onClick={loadBalance}
              >
                Actualizar
              </Button>
            </div>
            
            {balance < 10 && (
              <Chip 
                color="warning" 
                variant="flat" 
                size="sm" 
                className="w-full justify-center"
              >
                Mínimo S/ 10.00 para retirar
              </Chip>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Modal de Retiro */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Solicitar Retiro
              </ModalHeader>
              <ModalBody>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <Input
                  label="Monto a Retirar"
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  value={withdrawForm.amount}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                  startContent={<span className="text-gray-400">S/</span>}
                  description={`Disponible: S/ ${balance.toFixed(2)}`}
                />

                <Select
                  label="Método de Retiro"
                  selectedKeys={[withdrawForm.method]}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, method: e.target.value })}
                >
                  <SelectItem key="paypal" value="paypal">PayPal</SelectItem>
                  <SelectItem key="bank" value="bank">Transferencia Bancaria</SelectItem>
                  <SelectItem key="yape" value="yape">Yape/Plin</SelectItem>
                </Select>

                <Input
                  label={withdrawForm.method === 'paypal' ? 'Email de PayPal' : 'Número/Cuenta'}
                  placeholder={withdrawForm.method === 'paypal' ? 'tu@email.com' : '912345678'}
                  value={withdrawForm.account}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, account: e.target.value })}
                />

                <Chip color="info" variant="flat" size="sm">
                  ℹ️ Retiros procesados en 24-48 horas hábiles
                </Chip>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button 
                  className="bg-gradient-to-r from-[#0764bf] to-[#1800ad] text-white"
                  onPress={handleWithdraw}
                  isLoading={loading}
                >
                  Confirmar Retiro
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
