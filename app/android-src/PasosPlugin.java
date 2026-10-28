package __PACKAGE__;

import android.Manifest;
import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.util.ArrayList;
import java.util.List;

/**
 * Plugin "Pasos": lee el contador de pasos del teléfono (sensor TYPE_STEP_COUNTER).
 * El sensor devuelve los pasos acumulados desde que se encendió el móvil;
 * el juego guarda la última lectura y convierte la diferencia en kilómetros.
 */
@CapacitorPlugin(
    name = "Pasos",
    permissions = { @Permission(strings = { Manifest.permission.ACTIVITY_RECOGNITION }, alias = "actividad") }
)
public class PasosPlugin extends Plugin implements SensorEventListener {

    private SensorManager sensores;
    private Sensor contador;
    private float ultimo = -1f;
    private boolean escuchando = false;
    private final List<PluginCall> esperando = new ArrayList<>();
    private final Handler hilo = new Handler(Looper.getMainLooper());

    @Override
    public void load() {
        sensores = (SensorManager) getContext().getSystemService(Context.SENSOR_SERVICE);
        contador = sensores != null ? sensores.getDefaultSensor(Sensor.TYPE_STEP_COUNTER) : null;
        if (tienePermiso()) escuchar();
    }

    private boolean tienePermiso() {
        return Build.VERSION.SDK_INT < Build.VERSION_CODES.Q || getPermissionState("actividad") == PermissionState.GRANTED;
    }

    private JSObject estadoActual() {
        JSObject r = new JSObject();
        r.put("disponible", contador != null);
        r.put("permiso", tienePermiso());
        return r;
    }

    @PluginMethod
    public void estado(PluginCall call) {
        call.resolve(estadoActual());
    }

    @PluginMethod
    public void pedirPermiso(PluginCall call) {
        if (contador == null || tienePermiso()) {
            if (contador != null) escuchar();
            call.resolve(estadoActual());
            return;
        }
        requestPermissionForAlias("actividad", call, "trasPermiso");
    }

    @PermissionCallback
    private void trasPermiso(PluginCall call) {
        if (tienePermiso()) escuchar();
        call.resolve(estadoActual());
    }

    @PluginMethod
    public void leer(PluginCall call) {
        if (contador == null) { call.reject("Este móvil no tiene contador de pasos", "SIN_SENSOR"); return; }
        if (!tienePermiso()) { call.reject("Falta el permiso de actividad física", "SIN_PERMISO"); return; }
        escuchar();
        if (ultimo >= 0) { responder(call); return; }
        esperando.add(call);
        hilo.postDelayed(() -> {
            if (esperando.remove(call)) {
                JSObject r = new JSObject();
                r.put("pasos", -1);
                r.put("arranque", arranque());
                call.resolve(r);
            }
        }, 4000);
    }

    private long arranque() {
        return System.currentTimeMillis() - SystemClock.elapsedRealtime();
    }

    private void responder(PluginCall call) {
        JSObject r = new JSObject();
        r.put("pasos", (long) ultimo);
        r.put("arranque", arranque());
        call.resolve(r);
    }

    private void escuchar() {
        if (escuchando || contador == null || sensores == null) return;
        escuchando = sensores.registerListener(this, contador, SensorManager.SENSOR_DELAY_NORMAL);
    }

    @Override
    public void onSensorChanged(SensorEvent evento) {
        ultimo = evento.values[0];
        List<PluginCall> pendientes = new ArrayList<>(esperando);
        esperando.clear();
        for (PluginCall c : pendientes) responder(c);
        JSObject datos = new JSObject();
        datos.put("pasos", (long) ultimo);
        notifyListeners("pasos", datos);
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int precision) { }

    @Override
    protected void handleOnDestroy() {
        if (sensores != null && escuchando) sensores.unregisterListener(this);
        escuchando = false;
    }
}
