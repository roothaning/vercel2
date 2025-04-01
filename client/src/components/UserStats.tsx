import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

export function UserStats() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/user'],
  });

  if (isLoading) {
    return (
      <section className="bg-dark-800 rounded-xl p-4 shadow-lg mb-6 border border-flame-700/30 animate-pulse">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-dark-700"></div>
          <div className="ml-3 flex-1">
            <div className="h-5 bg-dark-700 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-dark-700 rounded w-1/4"></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div className="bg-dark-700 rounded-lg p-2 h-14"></div>
          <div className="bg-dark-700 rounded-lg p-2 h-14"></div>
          <div className="bg-dark-700 rounded-lg p-2 h-14"></div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="bg-dark-800 rounded-xl p-4 shadow-lg mb-6 border border-flame-700/30">
        <p className="text-center text-gray-400">Failed to load user data</p>
      </section>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <section className="bg-dark-800 rounded-xl p-4 shadow-lg mb-6 border border-flame-700/30">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-flame-600 flex items-center justify-center overflow-hidden border-2 border-flame-400">
          <span className="text-lg font-bold">{getInitials(user.username)}</span>
        </div>
        <div className="ml-3">
          <h2 className="font-medium text-lg">{user.username}</h2>
          <p className="text-xs text-gray-400 font-mono">{user.tonAddress || 'No wallet connected'}</p>
        </div>
        <div className="ml-auto flex flex-col items-end">
          <div className="flex items-center mb-1">
            <img src="https://ton.org/download/ton_symbol.svg" alt="TON" className="w-4 h-4 mr-1" />
            <span className="font-mono text-sm">{user.tonBalance.toFixed(2)}</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-fire text-flame-500 mr-1"></i>
            <span className="font-mono text-sm">{user.flameBalance.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      {user.premiumTier && (
        <div className="flex justify-between items-center mb-2 bg-gradient-to-r from-flame-800 to-flame-600 rounded-lg p-2">
          <div className="flex items-center">
            <i className="fas fa-crown text-yellow-300 mr-2"></i>
            <span className="text-sm font-medium">
              {user.premiumTier === 'standard' ? 'Premium' : 'Premium VIP'}
            </span>
          </div>
          <div className="text-xs text-flame-100">
            <i className="far fa-clock mr-1"></i>
            <span>{user.premiumDaysLeft} days left</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mt-3">
        <div className="bg-dark-700 rounded-lg p-2 text-center">
          <div className="text-xs text-gray-400">Mining Power</div>
          <div className="font-medium">{user.miningPower} MP</div>
        </div>
        <div className="bg-dark-700 rounded-lg p-2 text-center">
          <div className="text-xs text-gray-400">Daily Yield</div>
          <div className="font-medium">{user.dailyYield} FC</div>
        </div>
        <div className="bg-dark-700 rounded-lg p-2 text-center">
          <div className="text-xs text-gray-400">Equipment</div>
          <div className="font-medium">{user.equipmentCount}/{user.equipmentMax}</div>
        </div>
      </div>
    </section>
  );
}
