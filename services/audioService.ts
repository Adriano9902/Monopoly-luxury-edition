
/**
 * Servizio Audio per Monopoly Business & Lusso
 * Gestisce la riproduzione di effetti sonori HQ per un'esperienza immersiva.
 */

import { DiceType } from "../types";

const SOUNDS = {
  // Suono secco/clack per il movimento
  MOVE: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3', 
  // Tintinnio di monete
  TRANSFER: 'https://assets.mixkit.co/active_storage/sfx/2012/2012-preview.mp3', 
  // Registratore di cassa pesante
  BANK: 'https://assets.mixkit.co/active_storage/sfx/2004/2004-preview.mp3', 
  // Chime positivo standard
  SUCCESS: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', 
  // Lancio dadi Standard
  DICE_STANDARD: 'https://assets.mixkit.co/active_storage/sfx/2005/2005-preview.mp3',
  // Lancio dadi Business (Elegante/Brillante)
  DICE_BUSINESS: 'https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3',
  // Lancio dadi Truffa (Digitale/Misterioso)
  DICE_TRUFFA: 'https://assets.mixkit.co/active_storage/sfx/2014/2014-preview.mp3',
  // Lancio dadi Chaos (Distorto/Pesante)
  DICE_CHAOS: 'https://assets.mixkit.co/active_storage/sfx/2007/2007-preview.mp3',
  // Trionfale/Orchestrale per completamento Monopolio
  MONOPOLY: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  // Suono negativo/errore (Fallimento, Truffa fallita)
  FAIL: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
  // Suono di sblocco/riscatto (Unlock)
  REDEEM: 'https://assets.mixkit.co/active_storage/sfx/2016/2016-preview.mp3',
  // Suono meccanico/chiusura (Ipoteca)
  MORTGAGE: 'https://assets.mixkit.co/active_storage/sfx/2021/2021-preview.mp3'
};

class AudioService {
  private play(url: string, volume: number = 0.5) {
    try {
      const audio = new Audio(url);
      audio.volume = volume;
      audio.currentTime = 0; 
      audio.play().catch(e => {
        // Ignora warning di autoplay
      });
    } catch (error) {
      console.error("Audio Error:", error);
    }
  }

  playMove() {
    this.play(SOUNDS.MOVE, 0.7);
  }

  playTransfer() {
    this.play(SOUNDS.TRANSFER, 0.8);
  }

  playBankPayment() {
    this.play(SOUNDS.BANK, 0.7);
  }

  playPurchase() {
    this.play(SOUNDS.SUCCESS, 0.5);
  }

  playDice() {
    this.play(SOUNDS.DICE_STANDARD, 0.4);
  }

  playSpecialDice(type: DiceType) {
    switch (type) {
      case 'BUSINESS':
        this.play(SOUNDS.DICE_BUSINESS, 0.6);
        break;
      case 'TRUFFA':
        this.play(SOUNDS.DICE_TRUFFA, 0.6);
        break;
      case 'CHAOS':
        this.play(SOUNDS.DICE_CHAOS, 0.7);
        break;
      default:
        this.play(SOUNDS.DICE_STANDARD, 0.4);
    }
  }

  /** Riproduce un suono trionfale quando un giocatore completa un settore */
  playMonopoly() {
    this.play(SOUNDS.MONOPOLY, 1.0);
  }

  /** Riproduce un suono di errore/fallimento (es. Truffa andata male, Bancarotta) */
  playFail() {
    this.play(SOUNDS.FAIL, 0.8);
  }

  /** Riproduce un suono positivo di sblocco (Riscatto ipoteca) */
  playRedeem() {
    this.play(SOUNDS.REDEEM, 0.8);
  }

  /** Riproduce un suono meccanico di chiusura (Ipoteca asset) */
  playMortgage() {
    this.play(SOUNDS.MORTGAGE, 0.6);
  }
}

export const audioService = new AudioService();
