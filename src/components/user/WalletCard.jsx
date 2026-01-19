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
  Divider,
  Chip
} from '@nextui-org/react';
import { Wallet, TrendingUp, ArrowUpRight, Eye, EyeOff } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const WalletCard = () => {
  const { currentUser } = useAuth();
  const [balance, setBalance] = useState(0);
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
  }, [currentUser]);

  const loadBalance = async () => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setBalance(userSnap.data().balance || 0);
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
      // Crear solicitud de retiro
      const withdrawalsRef = collection(db, 'withdrawals');
      await addDoc(withdrawalsRef, {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        amount: amount,
        method: withdrawForm.method,
        account: withdrawForm.account,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      // Cerrar modal y resetear formulario
      onOpenChange();
      setWithdrawForm({
        amount: '',
        method: 'paypal',
        account: '',
      });
      
      alert('¡Solicitud de retiro enviada! Será procesada pronto.');
    } catch (err) {
      setError('Error al procesar la solicitud');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-purple-500 to-pink-600 border-none shadow-xl" data-testid="wallet-card">
        <CardHeader className="flex justify-between items-center pb-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Wallet className="text-white" size={20} />
            </div>
            <span className="text-white font-semibold">Mi Billetera</span>
          </div>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onClick={() => setShowBalance(!showBalance)}
            data-testid="toggle-balance-visibility"
          >
            {showBalance ? <Eye className="text-white" size={18} /> : <EyeOff className="text-white" size={18} />}
          </Button>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div>
              <p className="text-white/80 text-sm">Saldo Disponible</p>
              <p className="text-4xl font-bold text-white" data-testid="balance-amount">
                {showBalance ? `S/. ${balance.toFixed(2)}` : 'S/. ****'}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                data-testid="withdraw-button"
                className="flex-1 bg-white text-purple-600 font-semibold"
                startContent={<ArrowUpRight size={18} />}
                onClick={onOpen}
                isDisabled={balance < 10}
              >
                Retirar
              </Button>
              <Button
                data-testid="refresh-balance-button"
                variant="bordered"
                className="text-white border-white/30"
                onClick={loadBalance}
              >
                Actualizar
              </Button>
            </div>
            
            {balance < 10 && (
              <Chip color="warning" variant="flat" size="sm" className="w-full">
                Mínimo S/. 10.00 para retirar
              </Chip>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Modal de Retiro */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} data-testid="withdraw-modal">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Solicitar Retiro
              </ModalHeader>
              <ModalBody>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" data-testid="withdraw-error">
                    {error}
                  </div>
                )}

                <Input
                  data-testid="withdraw-amount-input"
                  label="Monto a Retirar"
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  value={withdrawForm.amount}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                  startContent={<span className="text-gray-400">S/.</span>}
                  description={`Disponible: S/. ${balance.toFixed(2)}`}
                />

                <Select
                  data-testid="withdraw-method-select"
                  label="Método de Retiro"
                  selectedKeys={[withdrawForm.method]}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, method: e.target.value })}
                >
                  <SelectItem key="paypal" value="paypal">PayPal</SelectItem>
                  <SelectItem key="bank" value="bank">Transferencia Bancaria</SelectItem>
                </Select>

                <Input
                  data-testid="withdraw-account-input"
                  label={withdrawForm.method === 'paypal' ? 'Email de PayPal' : 'Número de Cuenta'}
                  placeholder={withdrawForm.method === 'paypal' ? 'tu@email.com' : '1234567890'}
                  value={withdrawForm.account}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, account: e.target.value })}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button 
                  data-testid="confirm-withdraw-button"
                  color="primary" 
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
};

export default WalletCard;
